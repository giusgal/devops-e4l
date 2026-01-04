# User Acceptance Tests (UAT) for E4L Platform

This directory contains the User Acceptance Tests (UAT) for the Energy4Life (E4L) platform.

## Overview

User Acceptance Tests verify that the system meets the business requirements and works correctly from an end-user perspective. These tests simulate real user interactions with the platform.

## Test Categories

### 1. Questionnaire Access (UAT-1)
- Verifies users can access the energy questionnaire
- Tests the `/questionnaire` endpoint

### 2. Questionnaire Completion (UAT-2)
- Verifies users can submit their answers
- Tests session creation via `/session` endpoint

### 3. Energy Calculation (UAT-3)
- Verifies the energy footprint calculation works
- Tests `/calculate/energyConsumption` endpoint

### 4. Kids Mode (UAT-4)
- Verifies children can use the questionnaire
- Tests session creation with `iskid: true`

### 5. Statistics (UAT-5)
- Verifies response count is accessible
- Tests `/responses/count` endpoint

### 6. Seminar Mode (UAT-6)
- Verifies seminar code validation
- Tests `/calculate/seminar/{code}` endpoint

### 7. Contact Form (UAT-7)
- Verifies contact form submission
- Tests `/contact` endpoint

### 8. Frontend Accessibility (UAT-8)
- Verifies the website is accessible
- Tests frontend URL

### 9. Error Handling (UAT-9)
- Verifies API handles errors gracefully
- Tests malformed request handling

### 10. Complete User Journey (UAT-10)
- End-to-end test of the complete user flow
- Tests: questionnaire → answers → results

## Running the Tests

### Prerequisites
- Both backend and frontend must be deployed
- `curl` must be installed

### Environment Variables
```bash
export BACKEND_URL="http://localhost:8084/e4lapi"
export FRONTEND_URL="http://localhost:8890"
```

### Execute Tests
```bash
chmod +x run_uat_tests.sh
./run_uat_tests.sh
```

### CI/CD Integration
These tests are automatically run in the staging stage of the CI/CD pipeline after both frontend and backend are deployed.

## Success Criteria
- All 10 UAT tests should pass
- Minimum pass rate threshold: 70%

## Test Results
Test results are printed to stdout with color-coded output:
- 🟢 PASSED: Test succeeded
- 🔴 FAILED: Test failed
- Summary shows total pass/fail counts and percentage
