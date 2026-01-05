import { hideNavButton, showNavButton, hideLogoutButton, showLogoutButton } from '../action/navAction';
import navReducer from '../reducer/navReducer';

describe('Navigation Integration Test', () => {
  describe('Action and Reducer integration', () => {
    it('should handle complete navigation flow: hide nav buttons -> show logout -> hide logout -> show nav', () => {
      // Initial state
      let state = {
        isNavButtonsDisabled: "false",
        isLogoutButtonDisabled: "true",
      };

      // Step 1: User logs in - hide nav buttons
      const hideNavAction = hideNavButton();
      state = navReducer(state, hideNavAction);
      expect(state).toEqual({
        isNavButtonsDisabled: "true",
        isLogoutButtonDisabled: "true",
      });

      // Step 2: Show logout button after login
      const showLogoutAction = showLogoutButton();
      state = navReducer(state, showLogoutAction);
      expect(state).toEqual({
        isNavButtonsDisabled: "true",
        isLogoutButtonDisabled: "false",
      });

      // Step 3: User logs out - hide logout button
      const hideLogoutAction = hideLogoutButton();
      state = navReducer(state, hideLogoutAction);
      expect(state).toEqual({
        isNavButtonsDisabled: "false",
        isLogoutButtonDisabled: "true",
      });

      // Step 4: Show nav buttons again
      const showNavAction = showNavButton();
      state = navReducer(state, showNavAction);
      expect(state).toEqual({
        isNavButtonsDisabled: "false",
        isLogoutButtonDisabled: "true",
      });
    });
  });
});
