
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
  originalError?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  
  constructor(context: SecurityRuleContext) {
    const message = context.originalError?.message || `FirestoreError: Missing or insufficient permissions at ${context.path} for ${context.operation}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
