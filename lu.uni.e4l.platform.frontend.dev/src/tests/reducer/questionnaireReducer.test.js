/**
 * Unit tests for questionnaireReducer
 * 
 * These tests verify the Redux reducer correctly handles
 * questionnaire-related actions and state changes.
 */

import questionnaireReducer from '../../js/reducer/questionnaireReducer';

describe('questionnaireReducer', () => {
  const initialState = {
    kid: false,
    canGoNext: false,
    currentQuestion: 0,
    altCurrentQuestion: 0,
    totalNbQuestion: 0,
    sessionCount: 0,
    calculateAble: false,
    fetched: false,
    fetching: false,
    showMaxThreshErrorMsg: false,
    maxThreshErrorMsg: "The value can't be greater than 10!",
    error: null,
    questionnaire: {
      questions: [],
    },
  };

  // Test 1: Initial state
  test('should return initial state when no action is provided', () => {
    const result = questionnaireReducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });

  // Test 2: SET_KID action
  test('should handle SET_KID action with true value', () => {
    const action = { type: 'SET_KID', payload: true };
    const result = questionnaireReducer(initialState, action);
    expect(result.kid).toBe(true);
  });

  test('should handle SET_KID action with false value', () => {
    const state = { ...initialState, kid: true };
    const action = { type: 'SET_KID', payload: false };
    const result = questionnaireReducer(state, action);
    expect(result.kid).toBe(false);
  });

  // Test 3: FETCH_QUESTIONNAIRE_PENDING action
  test('should handle FETCH_QUESTIONNAIRE_PENDING action', () => {
    const action = { type: 'FETCH_QUESTIONNAIRE_PENDING' };
    const result = questionnaireReducer(initialState, action);
    
    expect(result.fetching).toBe(true);
    expect(result.fetched).toBe(false);
    expect(result.error).toBeNull();
    expect(result.questionnaire.questions).toEqual([]);
  });

  // Test 4: FETCH_QUESTIONNAIRE_REJECTED action
  test('should handle FETCH_QUESTIONNAIRE_REJECTED action', () => {
    const error = new Error('Network error');
    const action = { type: 'FETCH_QUESTIONNAIRE_REJECTED', payload: error };
    const result = questionnaireReducer(initialState, action);
    
    expect(result.fetching).toBe(false);
    expect(result.fetched).toBe(false);
    expect(result.error).toBe(error);
  });

  // Test 5: FETCH_QUESTIONNAIRE_FULFILLED action
  test('should handle FETCH_QUESTIONNAIRE_FULFILLED action', () => {
    const mockQuestions = [
      { id: 1, name: 'Question 1' },
      { id: 2, name: 'Question 2' },
    ];
    const action = {
      type: 'FETCH_QUESTIONNAIRE_FULFILLED',
      payload: { data: mockQuestions },
    };
    
    const result = questionnaireReducer(initialState, action);
    
    expect(result.fetching).toBe(false);
    expect(result.fetched).toBe(true);
    expect(result.error).toBeNull();
    expect(result.questionnaire.questions).toEqual(mockQuestions);
  });

  // Test 6: NEXT_PAGE action
  test('should handle NEXT_PAGE action when not at last question', () => {
    const state = {
      ...initialState,
      currentQuestion: 0,
      questionnaire: {
        questions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    const action = { type: 'NEXT_PAGE' };
    const result = questionnaireReducer(state, action);
    
    expect(result.currentQuestion).toBe(1);
    expect(result.canGoNext).toBe(false);
  });

  test('should not increment currentQuestion when at last question', () => {
    const state = {
      ...initialState,
      currentQuestion: 2,
      questionnaire: {
        questions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    const action = { type: 'NEXT_PAGE' };
    const result = questionnaireReducer(state, action);
    
    expect(result.currentQuestion).toBe(2);
  });

  // Test 7: PREVIOUS_PAGE action
  test('should handle PREVIOUS_PAGE action when not at first question', () => {
    const state = {
      ...initialState,
      currentQuestion: 2,
      questionnaire: {
        questions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    const action = { type: 'PREVIOUS_PAGE' };
    const result = questionnaireReducer(state, action);
    
    expect(result.currentQuestion).toBe(1);
  });

  test('should not decrement currentQuestion when at first question', () => {
    const state = {
      ...initialState,
      currentQuestion: 0,
      questionnaire: {
        questions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    };
    const action = { type: 'PREVIOUS_PAGE' };
    const result = questionnaireReducer(state, action);
    
    expect(result.currentQuestion).toBe(0);
  });

  // Test 8: SHOW_MAX_THRESHOLD_ERROR_MSG action
  test('should handle SHOW_MAX_THRESHOLD_ERROR_MSG action', () => {
    const action = {
      type: 'SHOW_MAX_THRESHOLD_ERROR_MSG',
      payload: { msg: 'Custom error message' },
    };
    const result = questionnaireReducer(initialState, action);
    
    expect(result.showMaxThreshErrorMsg).toBe(true);
    expect(result.maxThreshErrorMsg).toBe('Custom error message');
  });

  // Test 9: HIDE_MAX_THRESHOLD_ERROR_MSG action
  test('should handle HIDE_MAX_THRESHOLD_ERROR_MSG action', () => {
    const state = {
      ...initialState,
      showMaxThreshErrorMsg: true,
      maxThreshErrorMsg: 'Some error',
    };
    const action = { type: 'HIDE_MAX_THRESHOLD_ERROR_MSG' };
    const result = questionnaireReducer(state, action);
    
    expect(result.showMaxThreshErrorMsg).toBe(false);
  });

  // Test 10: RESTART_QUESTIONNAIRE action
  test('should handle RESTART_QUESTIONNAIRE action', () => {
    const state = {
      ...initialState,
      currentQuestion: 5,
      canGoNext: true,
    };
    const action = { type: 'RESTART_QUESTIONNAIRE', payload: 0 };
    const result = questionnaireReducer(state, action);
    
    expect(result.currentQuestion).toBe(0);
  });
});
