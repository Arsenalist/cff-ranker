class MultiMessageError extends Error {
  errorMessages: string[] = []
  constructor(message) {
    super(message);
    this.name = "MultiMessageError";
  }

  get errors() {
    return this.errorMessages
  }

  set errors(errorMessages) {
    this.errorMessages = errorMessages
  }
}

export { MultiMessageError }
