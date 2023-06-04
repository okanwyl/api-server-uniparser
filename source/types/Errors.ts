class AlreadyExistUniversity extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "AlreadyExistUniversity";
  }
}

class UniversityNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "UniversityNotFound";
  }
}
