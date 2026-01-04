/**
 * Unit tests for answerAction
 * 
 * These tests verify the Redux action creators return
 * the correct action objects.
 */

import * as actions from '../../js/action/answerAction';

// Mock axios
jest.mock('axios/index', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('answerAction', () => {
  // Test 1: selectPossibleAnswer action without variable
  test('selectPossibleAnswer should return correct action without variable', () => {
    const action = actions.selectPossibleAnswer(1, null);
    expect(action.type).toBe('SELECT_ANSWER');
    expect(action.payload.possibleAnswerId).toBe(1);
    expect(action.payload.variable).toBeNull();
  });

  // Test 2: selectPossibleAnswer action with variable
  test('selectPossibleAnswer should return correct action with variable', () => {
    const variable = {
      variable: { id: 10, name: 'distance' },
      value: 100,
    };
    const action = actions.selectPossibleAnswer(1, variable);
    expect(action.type).toBe('SELECT_ANSWER');
    expect(action.payload.possibleAnswerId).toBe(1);
    expect(action.payload.variable).toEqual(variable);
  });

  // Test 3: unselectPossibleAnswer action
  test('unselectPossibleAnswer should return correct action', () => {
    const action = actions.unselectPossibleAnswer(1, 10);
    expect(action.type).toBe('UNSELECT_ANSWER');
    expect(action.payload.possibleAnswerId).toBe(1);
    expect(action.payload.variableId).toBe(10);
  });

  test('unselectPossibleAnswer should handle null variableId', () => {
    const action = actions.unselectPossibleAnswer(1, null);
    expect(action.type).toBe('UNSELECT_ANSWER');
    expect(action.payload.possibleAnswerId).toBe(1);
    expect(action.payload.variableId).toBeNull();
  });

  // Test 4: sendSession action without seminar code
  test('sendSession should return correct action for regular session', () => {
    const session = {
      seminar_access_code: null,
      answers: [],
      iskid: false,
    };
    const action = actions.sendSession(session);
    expect(action.type).toBe('SEND_SESSION');
    expect(action.payload).toBeDefined();
  });

  // Test 5: sendSession action with seminar code
  test('sendSession should return correct action for seminar session', () => {
    const session = {
      seminar_access_code: 'ABC123',
      answers: [],
      iskid: false,
    };
    const action = actions.sendSession(session);
    expect(action.type).toBe('SEND_SESSION');
    expect(action.payload).toBeDefined();
  });

  // Test 6: computeEnergy action
  test('computeEnergy should return correct action type', () => {
    const session = {
      answers: [],
      iskid: false,
    };
    const action = actions.computeEnergy(session);
    expect(action.type).toBe('COMPUTE_ENERGY');
    expect(action.payload).toBeDefined();
  });

  // Test 7: emptySession action
  test('emptySession should return correct action type', () => {
    const action = actions.emptySession();
    expect(action.type).toBe('EMPTY_SESSION');
    expect(action.payload).toBeNull();
  });

  // Test 8: fetchResult action
  test('fetchResult should return correct action with sessionId', () => {
    const sessionId = 'session-123';
    const action = actions.fetchResult(sessionId);
    expect(action.type).toBe('FETCH_RESULT');
    expect(action.payload).toBeDefined();
  });

  // Test 9: setSeminarInSession action
  test('setSeminarInSession should return correct action', () => {
    const seminarCode = 'SEMINAR123';
    const action = actions.setSeminarInSession(seminarCode);
    expect(action.type).toBe('SET_SEMINAR_IN_SESSION');
    expect(action.payload).toBe(seminarCode);
  });

  test('setSeminarInSession should handle null code', () => {
    const action = actions.setSeminarInSession(null);
    expect(action.type).toBe('SET_SEMINAR_IN_SESSION');
    expect(action.payload).toBeNull();
  });
});
