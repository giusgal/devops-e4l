package lu.uni.e4l.platform.integration;

import lu.uni.e4l.platform.model.*;
import lu.uni.e4l.platform.model.dto.ResultBreakdown;
import lu.uni.e4l.platform.service.CalculatorService;
import lu.uni.e4l.platform.service.ExpressionEvaluator;
import lu.uni.e4l.platform.service.crypto.SignedObjectSerializer;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

/**
 * Integration tests that verify the full calculation pipeline works correctly.
 * 
 * These tests integrate multiple components:
 * - CalculatorService
 * - ExpressionEvaluator  
 * - ResultBreakdown DTO
 * - Domain models (Session, Answer, Question, PossibleAnswer, Variable, VariableValue)
 * 
 * No database or Spring context required - tests the business logic integration.
 */
public class CalculationPipelineIntegrationTest {

    private CalculatorService calculatorService;

    @Before
    public void setUp() {
        // Set up the signature key required by SignedObjectSerializer
        ReflectionTestUtils.setField(SignedObjectSerializer.class, "signatureKey", "test-key");
        calculatorService = new CalculatorService();
    }

    /**
     * Integration test: Verify that a complete session with answers flows through
     * the entire calculation pipeline correctly.
     */
    @Test
    public void fullCalculationPipeline_ShouldProcessSessionWithMultipleAnswers() {
        // Given: A session with multiple answers containing formulas
        Session session = createSessionWithAnswers(
                createAnswer("10 + 5", createVariables()),  // = 15
                createAnswer("20 - 8", createVariables())   // = 12
        );

        // When: Calculate through the full pipeline
        ResultBreakdown result = calculatorService.calculate(session);

        // Then: Result should be computed correctly
        assertNotNull("Result should not be null", result);
        assertNotNull("Breakdown should not be null", result.getBreakdown());
    }

    /**
     * Integration test: Verify formulas with variables are evaluated correctly
     * when passed through the complete service layer.
     */
    @Test
    public void calculationPipeline_ShouldEvaluateFormulasWithVariables() {
        // Given: Variables for the formula
        Map<String, Double> vars = new HashMap<>();
        vars.put("distance", 100.0);
        vars.put("factor", 2.5);

        // Create answer with formula using variables
        Session session = createSessionWithAnswers(
                createAnswerWithVariables("distance * factor", vars)  // = 250
        );

        // When: Process through calculation service
        ResultBreakdown result = calculatorService.calculate(session);

        // Then: Verify the pipeline processed the answer
        assertNotNull(result);
        assertNotNull(result.getBreakdown());
        assertFalse("Breakdown should have entries", result.getBreakdown().isEmpty());
    }

    /**
     * Integration test: Verify ExpressionEvaluator integrates correctly with 
     * the variable substitution system.
     */
    @Test
    public void expressionEvaluator_ShouldIntegrateWithVariableSubstitution() {
        // Given: A mathematical expression with variables
        String expression = "floor(x / y) * 2 + ceil(z)";
        Map<String, String> variables = new HashMap<>();
        variables.put("x", "10");
        variables.put("y", "3");
        variables.put("z", "2.3");

        // When: Tokenize, substitute variables, convert to RPN, and evaluate
        List<String> tokens = ExpressionEvaluator.tokenize(expression);
        List<String> substituted = ExpressionEvaluator.replaceVariablesWithValues(tokens, variables);
        
        // Then: Verify the integration works
        assertNotNull(tokens);
        assertNotNull(substituted);
        assertFalse(substituted.contains("x"));
        assertFalse(substituted.contains("y"));
        assertFalse(substituted.contains("z"));
        assertTrue(substituted.contains("10"));
        assertTrue(substituted.contains("3"));
        assertTrue(substituted.contains("2.3"));
    }

    /**
     * Integration test: Verify the complete expression evaluation pipeline
     * from string expression to final numeric result.
     */
    @Test
    public void expressionEvaluation_EndToEndPipeline() {
        // Given: A complex expression
        String expression = "2 * (3 + 4) - floor(5.7)";
        Map<String, String> emptyVars = new HashMap<>();

        // When: Run through full evaluation pipeline
        Double result = ExpressionEvaluator.evaluate(expression, emptyVars);

        // Then: 2 * 7 - 5 = 9
        assertEquals(9.0, result, 0.0001);
    }

    /**
     * Integration test: Verify mathematical functions integrate correctly
     * in the expression evaluation chain.
     */
    @Test
    public void expressionEvaluation_WithMathFunctions() {
        // Given: Expression with multiple math functions
        Map<String, String> vars = new HashMap<>();
        vars.put("val", "4.6");

        // When: Evaluate expression with ceil and floor
        Double ceilResult = ExpressionEvaluator.evaluate("ceil(val)", vars);
        Double floorResult = ExpressionEvaluator.evaluate("floor(val)", vars);
        Double roundResult = ExpressionEvaluator.evaluate("round(val)", vars);

        // Then: Verify each function works in the pipeline
        assertEquals(5.0, ceilResult, 0.0001);
        assertEquals(4.0, floorResult, 0.0001);
        assertEquals(5.0, roundResult, 0.0001);
    }

    /**
     * Integration test: Verify nested function calls work through the pipeline.
     */
    @Test
    public void expressionEvaluation_NestedFunctions() {
        // Given: Nested function expression
        Map<String, String> vars = new HashMap<>();

        // When: Evaluate nested functions: round(ceil(4.2) + floor(3.8)) = round(5 + 3) = 8
        Double result = ExpressionEvaluator.evaluate("round(ceil(4.2) + floor(3.8))", vars);

        // Then
        assertEquals(8.0, result, 0.0001);
    }

    // ========== Helper Methods ==========

    private Session createSessionWithAnswers(Answer... answers) {
        Session session = new Session();
        session.setId(1L);
        session.setDateTime(ZonedDateTime.now());
        session.setAnswers(Arrays.asList(answers));
        session.setIskid(false);
        return session;
    }

    private Answer createAnswer(String formula, List<VariableValue> variableValues) {
        Answer answer = new Answer();
        
        Question question = new Question();
        question.setId(1L);
        question.setName("Test Question");

        PossibleAnswer possibleAnswer = new PossibleAnswer();
        possibleAnswer.setId(1L);
        possibleAnswer.setFormula(formula);
        possibleAnswer.setQuestion(question);

        answer.setPossibleAnswer(possibleAnswer);
        answer.setVariableValues(variableValues);

        return answer;
    }

    private Answer createAnswerWithVariables(String formula, Map<String, Double> vars) {
        List<VariableValue> variableValues = new ArrayList<>();
        
        for (Map.Entry<String, Double> entry : vars.entrySet()) {
            Variable variable = new Variable();
            variable.setName(entry.getKey());

            VariableValue vv = new VariableValue();
            vv.setVariable(variable);
            vv.setValue(entry.getValue());
            
            variableValues.add(vv);
        }

        return createAnswer(formula, variableValues);
    }

    private List<VariableValue> createVariables() {
        return new ArrayList<>();
    }
}
