/**
 * Unit tests for questionnaireAction
 * 
 * These tests verify the Redux action creators return
 * the correct action objects.
 */

import * as actions from '../../js/action/questionnaireAction';

// Mock axios
jest.mock('axios/index', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('questionnaireAction', () => {
  // Test 1: nextPage action
  test('nextPage should return correct action type', () => {
    const action = actions.nextPage();
    expect(action.type).toBe('NEXT_PAGE');
    expect(action.payload).toEqual({});
  });

  // Test 2: previousPage action
  test('previousPage should return correct action type', () => {
    const action = actions.previousPage();
    expect(action.type).toBe('PREVIOUS_PAGE');
    expect(action.payload).toEqual({});
  });

  // Test 3: setKid action
  test('setKid should return correct action with true payload', () => {
    const action = actions.setKid(true);
    expect(action.type).toBe('SET_KID');
    expect(action.payload).toBe(true);
  });

  test('setKid should return correct action with false payload', () => {
    const action = actions.setKid(false);
    expect(action.type).toBe('SET_KID');
    expect(action.payload).toBe(false);
  });

  // Test 4: showMaxThresholdErrorMessage action
  test('showMaxThresholdErrorMessage should return correct action', () => {
    const message = 'Test error message';
    const action = actions.showMaxThresholdErrorMessage(message);
    expect(action.type).toBe('SHOW_MAX_THRESHOLD_ERROR_MSG');
    expect(action.payload.msg).toBe(message);
  });

  // Test 5: hideMaxThresholdErrorMessage action
  test('hideMaxThresholdErrorMessage should return correct action type', () => {
    const action = actions.hideMaxThresholdErrorMessage();
    expect(action.type).toBe('HIDE_MAX_THRESHOLD_ERROR_MSG');
    expect(action.payload).toEqual({});
  });

  // Test 6: goToQuestion action
  test('goToQuestion should return correct action with question index', () => {
    const questionIndex = 5;
    const action = actions.goToQuestion(questionIndex);
    expect(action.type).toBe('GO_TO_QUESTION');
    expect(action.payload.question).toBe(questionIndex);
  });

  // Test 7: saveQuestionIndex action
  test('saveQuestionIndex should return correct action type', () => {
    const action = actions.saveQuestionIndex();
    expect(action.type).toBe('SAVE_QUESTION_INDEX');
    expect(action.payload).toEqual({});
  });

  // Test 8: restartQuestionnaire action
  test('restartQuestionnaire should return correct action', () => {
    const action = actions.restartQuestionnaire();
    expect(action.type).toBe('RESTART_QUESTIONNAIRE');
    expect(action.payload).toBe(0);
  });

  // Test 9: fetchQuestionnaire action
  test('fetchQuestionnaire should return correct action type and promise', () => {
    const action = actions.fetchQuestionnaire();
    expect(action.type).toBe('FETCH_QUESTIONNAIRE');
    expect(action.payload).toBeDefined();
    expect(action.payload.then).toBeDefined(); // It's a promise
  });

  // Test 10: fetchSessionCount action
  test('fetchSessionCount should return correct action type for adults', () => {
    const action = actions.fetchSessionCount(false);
    expect(action.type).toBe('FETCH_SESSION_COUNT');
    expect(action.payload).toBeDefined();
  });

  test('fetchSessionCount should return correct action type for kids', () => {
    const action = actions.fetchSessionCount(true);
    expect(action.type).toBe('FETCH_SESSION_COUNT');
    expect(action.payload).toBeDefined();
  });

  // Test 11: fetchIsCalculatedisabled action
  test('fetchIsCalculatedisabled should return correct action type', () => {
    const action = actions.fetchIsCalculatedisabled();
    expect(action.type).toBe('FETCH_SESSION_DISABLED');
    expect(action.payload).toBeDefined();
  });
});
