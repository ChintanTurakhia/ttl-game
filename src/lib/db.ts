// Database interfaces
export interface Statement {
  id: string;
  userFid: number;
  username?: string;
  statements: [string, string, string];
  lieIndex: number; // 0, 1, or 2 (which statement is the lie)
  createdAt: number;
}

export interface Score {
  userFid: number;
  points: number;
}

// Simple localStorage-based database
export class DB {
  private static STATEMENTS_KEY = "ttl_statements";
  private static SCORES_KEY = "ttl_scores";

  // Get all statements
  static getStatements(): Statement[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(this.STATEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Add a new statement
  static addStatement(statement: Statement): void {
    if (typeof window === "undefined") return;

    const statements = this.getStatements();
    statements.push(statement);
    localStorage.setItem(this.STATEMENTS_KEY, JSON.stringify(statements));
  }

  // Get statements to play (excluding user's own statements)
  static getStatementsToPlay(userFid: number): Statement[] {
    const statements = this.getStatements();
    return statements.filter((s) => s.userFid !== userFid);
  }

  // Get scores
  static getScores(): Score[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(this.SCORES_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Update score
  static updateScore(userFid: number, pointsToAdd: number): void {
    if (typeof window === "undefined") return;

    const scores = this.getScores();
    const userScore = scores.find((s) => s.userFid === userFid);

    if (userScore) {
      userScore.points += pointsToAdd;
    } else {
      scores.push({ userFid, points: pointsToAdd });
    }

    localStorage.setItem(this.SCORES_KEY, JSON.stringify(scores));
  }

  // Get user score
  static getUserScore(userFid: number): number {
    const scores = this.getScores();
    const userScore = scores.find((s) => s.userFid === userFid);
    return userScore?.points || 0;
  }
}
