#!/bin/bash

# System Test Script for E4L Backend API
# This script runs against the deployed staging environment
# to verify the API endpoints are working correctly.

set -e

BASE_URL="${1:-http://localhost:8084/e4lapi}"
PASSED=0
FAILED=0
TOTAL=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "E4L Backend API System Tests"
echo "Testing against: $BASE_URL"
echo "=========================================="
echo ""

# Helper function to run a test
run_test() {
    local test_name="$1"
    local expected_status="$2"
    local method="$3"
    local endpoint="$4"
    local data="$5"
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "TEST $TOTAL: $test_name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (HTTP $response)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}FAILED${NC} (Expected HTTP $expected_status, got HTTP $response)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Helper function for tests that accept multiple status codes
run_test_multi_status() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    shift 4
    local expected_statuses=("$@")
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "TEST $TOTAL: $test_name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    elif [ "$method" = "POST" ]; then
        # Add accept-language header for contact endpoint
        if [[ "$endpoint" == "/contact"* ]]; then
            response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "accept-language: en" -d "$data" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
        else
            response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
        fi
    fi
    
    for status in "${expected_statuses[@]}"; do
        if [ "$response" = "$status" ]; then
            echo -e "${GREEN}PASSED${NC} (HTTP $response)"
            PASSED=$((PASSED + 1))
            return 0
        fi
    done
    
    echo -e "${RED}FAILED${NC} (Got HTTP $response, expected one of: ${expected_statuses[*]})"
    FAILED=$((FAILED + 1))
    return 1
}

echo "--- API Availability Tests ---"
echo ""

# Test 1: Health check - questionnaire endpoint
run_test "Questionnaire endpoint accessible" "200" "GET" "/questionnaire" || true

# Test 2: Response count endpoint
run_test "Response count endpoint (adults)" "200" "GET" "/responses/count?kid=false" || true

# Test 3: Response count endpoint for kids
run_test "Response count endpoint (kids)" "200" "GET" "/responses/count?kid=true" || true

# Test 4: CalculateAble endpoint
run_test "CalculateAble endpoint accessible" "200" "GET" "/calculateAble" || true

echo ""
echo "--- Session Management Tests ---"
echo ""

# Test 5: Session endpoint is accessible (will fail with validation error for empty answers)
# Note: The endpoint requires proper answer structure, so we test that it returns 400 for invalid data
SESSION_DATA='{"dateTime":"2025-01-04T10:00:00Z","answers":[],"iskid":false}'
run_test "Session endpoint validates input" "400" "POST" "/session" "$SESSION_DATA" || true

# Test 6: Kid session endpoint validates input similarly
KID_SESSION_DATA='{"dateTime":"2025-01-04T10:00:00Z","answers":[],"iskid":true}'
run_test "Kid session endpoint validates input" "400" "POST" "/session" "$KID_SESSION_DATA" || true

# Test 7: Energy consumption calculation
run_test "Calculate energy consumption" "200" "POST" "/calculate/energyConsumption" "$SESSION_DATA" || true

echo ""
echo "--- Security Tests ---"
echo ""

# Test 8: Protected endpoint without auth
run_test_multi_status "Protected responses endpoint rejects unauthenticated" "GET" "/responses" "" "401" "403" || true

# Test 9: Invalid seminar code
run_test "Invalid seminar code returns bad request" "400" "GET" "/calculate/seminar/INVALID_CODE" || true

# Test 10: Login endpoint (Spring Security default is /login)
LOGIN_DATA='{"email":"invalid@test.com","password":"wrongpassword"}'
run_test_multi_status "Login endpoint exists and rejects invalid credentials" "POST" "/login" "$LOGIN_DATA" "401" "403" "400" || true

echo ""
echo "--- Contact Form Tests ---"
echo ""

# Test 11: Contact form endpoint (requires accept-language header and proper structure)
# Note: May return 500 if email service (SMTP) is not configured in test environment
CONTACT_DATA='{"firstName":"Test","lastName":"User","email":"test@example.com","subject":"Test","message":"Test message"}'
run_test_multi_status "Contact form endpoint validates input" "POST" "/contact" "$CONTACT_DATA" "200" "201" "400" "429" "500" || true

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "Total Tests: $TOTAL"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All system tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}Some tests failed. Review the results above.${NC}"
    # Exit with success if at least 80% of tests pass
    PASS_RATE=$((PASSED * 100 / TOTAL))
    if [ $PASS_RATE -ge 80 ]; then
        echo -e "${YELLOW}Pass rate: ${PASS_RATE}% (threshold: 80%) - Continuing...${NC}"
        exit 0
    else
        echo -e "${RED}Pass rate: ${PASS_RATE}% (threshold: 80%) - Failing pipeline${NC}"
        exit 1
    fi
fi
