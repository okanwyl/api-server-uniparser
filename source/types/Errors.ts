export class AlreadyExistUniversity extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "AlreadyExistUniversity";
  }
}

export class UniversityNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "UniversityNotFound";
  }
}

export class CourseNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "CourseNotFound";
  }
}


export class InstructorNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "InstructorNotFound";
  }
}


export class PublicationNotFound extends Error {
  constructor(readonly message: string) {
    super(message);
    this.name = "PublicationNotFound";
  }
}