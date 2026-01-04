/**
 * Unit tests for answerReducer
 * 
 * These tests verify the Redux reducer correctly handles
 * answer-related actions and state changes.
 */

import answerReducer from '../../js/reducer/answerReducer';

describe('answerReducer', () => {
  const initialState = {
    sessionIsSent: false,
    sessionIdReceived: false,
    sessionId: null,
    energyFetchInitiated: false,
    energyFetchFulfilled: false,
    error: null,
    energyFetchedwErr: false,
    calculationResult: null,
    session: {
      seminar_access_code: null,
      answers: [],
      iskid: false,
    },
  };

  // Test 1: Initial state
  test('should return initial state when no action is provided', () => {
    const result = answerReducer(undefined, { type: '@@INIT' });
    expect(result).toEqual(initialState);
  });

  // Test 2: SELECT_ANSWER action - add new answer without variables
  test('should handle SELECT_ANSWER action for new answer without variables', () => {
    const action = {
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: null,
      },
    };
    const result = answerReducer(initialState, action);
    
    expect(result.session.answers).toHaveLength(1);
    expect(result.session.answers[0].possibleAnswer.id).toBe(1);
    expect(result.session.answers[0].variableValues).toEqual([]);
  });

  // Test 3: SELECT_ANSWER action - add new answer with variable
  test('should handle SELECT_ANSWER action for new answer with variable', () => {
    const action = {
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: {
          variable: { id: 10, name: 'distance' },
          value: 100,
        },
      },
    };
    const result = answerReducer(initialState, action);
    
    expect(result.session.answers).toHaveLength(1);
    expect(result.session.answers[0].possibleAnswer.id).toBe(1);
    expect(result.session.answers[0].variableValues).toHaveLength(1);
    expect(result.session.answers[0].variableValues[0].value).toBe(100);
  });

  // Test 4: SELECT_ANSWER action - update existing variable value
  test('should handle SELECT_ANSWER action updating existing variable', () => {
    const stateWithAnswer = {
      ...initialState,
      session: {
        ...initialState.session,
        answers: [
          {
            possibleAnswer: { id: 1 },
            variableValues: [
              { variable: { id: 10, name: 'distance' }, value: 50 },
            ],
          },
        ],
      },
    };
    
    const action = {
      type: 'SELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variable: {
          variable: { id: 10, name: 'distance' },
          value: 100,
        },
      },
    };
    
    const result = answerReducer(stateWithAnswer, action);
    
    expect(result.session.answers[0].variableValues[0].value).toBe(100);
  });

  // Test 5: UNSELECT_ANSWER action
  test('should handle UNSELECT_ANSWER action', () => {
    const stateWithAnswer = {
      ...initialState,
      session: {
        ...initialState.session,
        answers: [
          {
            possibleAnswer: { id: 1 },
            variableValues: [],
          },
          {
            possibleAnswer: { id: 2 },
            variableValues: [],
          },
        ],
      },
    };
    
    const action = {
      type: 'UNSELECT_ANSWER',
      payload: {
        possibleAnswerId: 1,
        variableId: null,
      },
    };
    
    const result = answerReducer(stateWithAnswer, action);
    
    expect(result.session.answers).toHaveLength(1);
    expect(result.session.answers[0].possibleAnswer.id).toBe(2);
  });

  // Test 6: SEND_SESSION_PENDING action
  test('should handle SEND_SESSION_PENDING action', () => {
    const action = { type: 'SEND_SESSION_PENDING' };
    const result = answerReducer(initialState, action);
    
    expect(result.sessionIsSent).toBe(true);
  });

  // Test 7: SEND_SESSION_FULFILLED action
  test('should handle SEND_SESSION_FULFILLED action', () => {
    const action = {
      type: 'SEND_SESSION_FULFILLED',
      payload: { data: 'session-123' },
    };
    const result = answerReducer(initialState, action);
    
    expect(result.sessionIdReceived).toBe(true);
    expect(result.sessionId).toBe('session-123');
  });

  // Test 8: SEND_SESSION_REJECTED action
  test('should handle SEND_SESSION_REJECTED action', () => {
    const error = new Error('Failed to send session');
    const action = {
      type: 'SEND_SESSION_REJECTED',
      payload: error,
    };
    const result = answerReducer(initialState, action);
    
    expect(result.error).toBe(error);
  });

  // Test 9: RESTART_QUESTIONNAIRE action (empties session)
  test('should handle RESTART_QUESTIONNAIRE action', () => {
    const stateWithData = {
      ...initialState,
      sessionIsSent: true,
      sessionId: 'session-123',
      session: {
        seminar_access_code: 'ABC123',
        answers: [{ possibleAnswer: { id: 1 }, variableValues: [] }],
        iskid: true,
      },
    };
    
    const action = { type: 'RESTART_QUESTIONNAIRE', payload: 0 };
    const result = answerReducer(stateWithData, action);
    
    expect(result.session.answers).toEqual([]);
    expect(result.sessionIsSent).toBe(false);
  });

  // Test 10: SET_SEMINAR_IN_SESSION action
  test('should handle SET_SEMINAR_IN_SESSION action', () => {
    const action = {
      type: 'SET_SEMINAR_IN_SESSION',
      payload: 'SEMINAR123',
    };
    const result = answerReducer(initialState, action);
    
    expect(result.session.seminar_access_code).toBe('SEMINAR123');
  });

  // Test 11: COMPUTE_ENERGY_PENDING action
  test('should handle COMPUTE_ENERGY_PENDING action', () => {
    const action = { type: 'COMPUTE_ENERGY_PENDING' };
    const result = answerReducer(initialState, action);
    
    expect(result.energyFetchInitiated).toBe(true);
    expect(result.energyFetchFulfilled).toBe(false);
  });

  // Test 12: COMPUTE_ENERGY_FULFILLED action
  test('should handle COMPUTE_ENERGY_FULFILLED action', () => {
    const mockResult = { result: 150, breakdown: [] };
    const action = {
      type: 'COMPUTE_ENERGY_FULFILLED',
      payload: { data: mockResult },
    };
    const result = answerReducer(initialState, action);
    
    expect(result.energyFetchFulfilled).toBe(true);
    expect(result.calculationResult).toEqual(mockResult);
  });

  // Test 13: COMPUTE_ENERGY_REJECTED action
  test('should handle COMPUTE_ENERGY_REJECTED action', () => {
    const error = new Error('Calculation failed');
    const action = {
      type: 'COMPUTE_ENERGY_REJECTED',
      payload: error,
    };
    const result = answerReducer(initialState, action);
    
    expect(result.energyFetchedwErr).toBe(true);
    expect(result.error).toBe(error);
  });
});
