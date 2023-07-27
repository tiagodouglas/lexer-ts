import { TokenType } from "./tokenType";

export default class Token {
    public type?: string;
    public literal?: string;
  
    constructor(tokenType?: string, literal?: string) {
      this.type = tokenType;
      this.literal = literal;
    }
  
    public lookupIdent(ident: string): string {
      const keywords: { [key: string]: string } = {
        fn: TokenType.FUNCTION,
        let: TokenType.LET,
        true: TokenType.TRUE,
        false: TokenType.FALSE,
        if: TokenType.IF,
        else: TokenType.ELSE,
        return: TokenType.RETURN,
      };
  
      const result = keywords[ident];
  
      return result ? result : TokenType.IDENT;
    }
  }