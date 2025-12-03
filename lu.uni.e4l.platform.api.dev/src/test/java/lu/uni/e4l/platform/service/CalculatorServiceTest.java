package lu.uni.e4l.platform.service;

import lu.uni.e4l.platform.service.crypto.SignedObjectSerializer;
import lu.uni.e4l.platform.model.*;

import org.junit.Assert;
import org.junit.Test;
import org.junit.Before;
import org.junit.runner.RunWith;

import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@TestPropertySource(locations="classpath:application.properties")
public class CalculatorServiceTest {

    private final CalculatorService calculatorService = new CalculatorService();
    @Value("${signature.key}")
    private String key;

    @Before
    public void setUp() {
        ReflectionTestUtils.setField(SignedObjectSerializer.class, "signatureKey", key);
    }

    @Test
    public void calculate() {
        Session session = getMockSession(
                getMockAnswer("floor(40 / n) * dist", asList(var("n", 5d), var("dist", 3d))),
                getMockAnswer("round(sin(x * y) / 2)", asList(var("x", 3.5), var("y", -2.5))),
                getMockAnswer("-1 * ceil(0.3 * x)", asList(var("x", 100.001)))
        );

        assertEquals(-7d, calculatorService.calculate(session).getResult(), 0.0000001);
    }

    private Session getMockSession(Answer... answers) {
        Session session = new Session();
        session.setAnswers(asList(answers));

        return session;
    }

    private Answer getMockAnswer(String formula, List<VariableValue> vars) {
        Answer answer = new Answer();

        Question question = new Question();
        question.setName("Test");

        PossibleAnswer possibleAnswer = new PossibleAnswer();
        possibleAnswer.setFormula(formula);
        possibleAnswer.setQuestion(question);

        answer.setPossibleAnswer(possibleAnswer);
        answer.setVariableValues(vars);

        return answer;
    }

    private VariableValue var(String name, Double value) {
        VariableValue variableValue = new VariableValue();

        Variable variable = new Variable();
        variable.setName(name);

        variableValue.setVariable(variable);
        variableValue.setValue(value);

        return variableValue;
    }
}