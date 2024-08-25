export const isActionStateOk = (state: null | Record<string, unknown>) =>
  state?.errors && Object.keys(state.errors).length === 0;
