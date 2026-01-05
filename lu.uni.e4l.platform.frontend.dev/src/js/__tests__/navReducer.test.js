import navReducer from '../reducer/navReducer';

describe('navReducer', () => {
  const initState = {
    isNavButtonsDisabled: "false",
    isLogoutButtonDisabled: "true",
  };

  it('should return the initial state', () => {
    expect(navReducer(undefined, {})).toEqual(initState);
  });

  it('should handle HIDE_NAV_BUTTONS', () => {
    const action = { type: 'HIDE_NAV_BUTTONS' };
    const expectedState = {
      isNavButtonsDisabled: "true",
      isLogoutButtonDisabled: "true",
    };
    expect(navReducer(initState, action)).toEqual(expectedState);
  });

  it('should handle SHOW_NAV_BUTTONS', () => {
    const action = { type: 'SHOW_NAV_BUTTONS' };
    const expectedState = {
      isNavButtonsDisabled: "false",
      isLogoutButtonDisabled: "true",
    };
    expect(navReducer(initState, action)).toEqual(expectedState);
  });

  it('should handle HIDE_LOGOUT_BUTTONS', () => {
    const action = { type: 'HIDE_LOGOUT_BUTTONS' };
    const expectedState = {
      isNavButtonsDisabled: "false",
      isLogoutButtonDisabled: "true",
    };
    expect(navReducer(initState, action)).toEqual(expectedState);
  });

  it('should handle SHOW_LOGOUT_BUTTONS', () => {
    const action = { type: 'SHOW_LOGOUT_BUTTONS' };
    const expectedState = {
      isNavButtonsDisabled: "true",
      isLogoutButtonDisabled: "false",
    };
    expect(navReducer(initState, action)).toEqual(expectedState);
  });

  it('should return current state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    expect(navReducer(initState, action)).toEqual(initState);
  });
});
