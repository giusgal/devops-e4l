/**
 * Integration tests for Redux store
 * 
 * These tests verify that actions, reducers, and state
 * work together correctly in the Redux store.
 */

import { createStore, combineReducers, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import questionnaireReducer from '../../js/reducer/questionnaireReducer';
import answerReducer from '../../js/reducer/answerReducer';

// Mock axios
jest.mock('axios/index', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: 'session-123' })),
}));

describe('Redux Store Integration', () => {
  let store;

  beforeEach(() => {
    // Create a fresh store for each test
    store = createStore(
      combineReducers({
        questionnaireReducer,
        answerReducer,
      }),
      applyMiddleware(promise())
    );
  });

  // Test 1: Initial state verification
  test('store should have correct initial state', () => {
    const state = store.getState();
    
    expect(state.questionnaireReducer.kid).toBe(false);
    expect(state.questionnaireReducer.currentQuestion).toBe(0);
    expect(state.questionnaireReducer.questionnaire.questions).toEqual([]);
    
    expect(state.answerReducer.session.answers).toEqual([]);
    expect(state.answerReducer.sessionIsSent).toBe(false);
  });

  // Test 2: Questionnaire navigation integration
  test('navigation through questionnaire should work correctly', () => {
    // Set up questionnaire with questions
    store.dispatch({
      type: 'FETCH_QUESTIONNAIRE_FULFILLED',
      payload: {
        data: [
          { id: 1, name: 'Question 1' },
          { id: 2, name: 'Question 2' },
          { id: 3, name: 'Question 3' },
        ],
      },
    });

    let state = store.getState();
    expect(state.questionnaireReducer.questionnaire.questions).toHaveLength(3);
    expect(state.questionnaireReducer.currentQuestion).toBe(0);

    // Navigate to next question
    store.dispatch({ type: 'NEXT_PAGE' });
    state = store.getState();
    expect(state.questionnaireReducer.currentQuestion).toBe(1);

    // Navigate to next question again
    store.dispatch({ type: 'NEXT_PAGE' });
    state = store.getState();
    expect(state.questionnaireReducer.currentQuestion).toBe(2);

    // Should not go beyond last question
    store.dispatch({ type: 'NEXT_PAGE' });
    state = store.getState();
    expect(state.questionnaireReducer.currentQuestion).toBe(2);

    // Navigate back
    store.dispatch({ type: 'PREVIOUS_PAGE' });
    state = store.getState();
    expect(state.questionnaireReducer.currentQuestion).toBe(1);
  });

  // Test 3: Answer selection integration
  test('selecting and unselecting answers should work correctly', () => {
    // Select first answer
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: null,
      },
    });

    let state = store.getState();
    expect(state.answerReducer.session.answers).toHaveLength(1);
    expect(state.answerReducer.session.answers[0].possibleAnswer.id).toBe(1);

    // Select second answer
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 2,
        variable: null,
      },
    });

    state = store.getState();
    expect(state.answerReducer.session.answers).toHaveLength(2);

    // Unselect first answer
    store.dispatch({
      type: 'UNSELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variableId: null,
      },
    });

    state = store.getState();
    expect(state.answerReducer.session.answers).toHaveLength(1);
    expect(state.answerReducer.session.answers[0].possibleAnswer.id).toBe(2);
  });

  // Test 4: Answer with variables integration
  test('answers with variable values should be handled correctly', () => {
    // Select answer with variable
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: {
          variable: { id: 10, name: 'distance' },
          value: 50,
        },
      },
    });

    let state = store.getState();
    expect(state.answerReducer.session.answers[0].variableValues).toHaveLength(1);
    expect(state.answerReducer.session.answers[0].variableValues[0].value).toBe(50);

    // Update variable value
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: {
          variable: { id: 10, name: 'distance' },
          value: 100,
        },
      },
    });

    state = store.getState();
    expect(state.answerReducer.session.answers[0].variableValues).toHaveLength(1);
    expect(state.answerReducer.session.answers[0].variableValues[0].value).toBe(100);
  });

  // Test 5: Kid mode integration
  test('kid mode should be set and reflected in session', () => {
    store.dispatch({ type: 'SET_KID', payload: true });
    
    let state = store.getState();
    expect(state.questionnaireReducer.kid).toBe(true);

    store.dispatch({ type: 'SET_KID', payload: false });
    
    state = store.getState();
    expect(state.questionnaireReducer.kid).toBe(false);
  });

  // Test 6: Seminar code integration
  test('seminar code should be set in session', () => {
    store.dispatch({
      type: 'SET_SEMINAR_IN_SESSION',
      payload: 'SEMINAR123',
    });

    const state = store.getState();
    expect(state.answerReducer.session.seminar_access_code).toBe('SEMINAR123');
  });

  // Test 7: Session reset integration
  test('restarting questionnaire should clear all answers', () => {
    // Add some answers
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: { possibleAnswerId: 1, variable: null },
    });
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: { possibleAnswerId: 2, variable: null },
    });

    let state = store.getState();
    expect(state.answerReducer.session.answers).toHaveLength(2);

    // Restart questionnaire (resets session)
    store.dispatch({ type: 'RESTART_QUESTIONNAIRE', payload: 0 });

    state = store.getState();
    expect(state.answerReducer.session.answers).toEqual([]);
  });

  // Test 8: Error state handling integration
  test('error states should be handled correctly', () => {
    const error = new Error('Network error');

    // Questionnaire fetch error
    store.dispatch({
      type: 'FETCH_QUESTIONNAIRE_REJECTED',
      payload: error,
    });

    let state = store.getState();
    expect(state.questionnaireReducer.error).toBe(error);
    expect(state.questionnaireReducer.fetching).toBe(false);
    expect(state.questionnaireReducer.fetched).toBe(false);
  });

  // Test 9: Full questionnaire flow integration
  test('complete questionnaire flow should work', () => {
    // 1. Fetch questionnaire
    store.dispatch({
      type: 'FETCH_QUESTIONNAIRE_FULFILLED',
      payload: {
        data: [
          { id: 1, name: 'Q1', possibleAnswers: [{ id: 101 }, { id: 102 }] },
          { id: 2, name: 'Q2', possibleAnswers: [{ id: 201 }, { id: 202 }] },
        ],
      },
    });

    // 2. Answer first question
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: { possibleAnswerId: 101, variable: null },
    });

    // 3. Go to next question
    store.dispatch({ type: 'NEXT_PAGE' });

    // 4. Answer second question
    store.dispatch({
      type: 'SELECT_ANSWER',
      payload: { possibleAnswerId: 201, variable: null },
    });

    const state = store.getState();
    expect(state.questionnaireReducer.questionnaire.questions).toHaveLength(2);
    expect(state.questionnaireReducer.currentQuestion).toBe(1);
    expect(state.answerReducer.session.answers).toHaveLength(2);
  });

  // Test 10: Go to specific question
  test('go to specific question should work', () => {
    // Set up questionnaire
    store.dispatch({
      type: 'FETCH_QUESTIONNAIRE_FULFILLED',
      payload: {
        data: [
          { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
        ],
      },
    });

    // Go to question 3 (index 3)
    store.dispatch({
      type: 'GO_TO_QUESTION',
      payload: { question: 3 },
    });

    const state = store.getState();
    expect(state.questionnaireReducer.currentQuestion).toBe(3);
  });
});
