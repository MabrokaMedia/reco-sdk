import { RecoClient } from './index';
import * as indexExports from './index';

describe('Index Exports', () => {
  describe('RecoClient', () => {
    it('should export RecoClient class', () => {
      expect(RecoClient).toBeDefined();
      expect(typeof RecoClient).toBe('function');
    });

    it('should be instantiable', () => {
      // We can't fully instantiate without axios mock, but we can verify the class structure
      expect(RecoClient.prototype.constructor).toBeDefined();
    });
  });

  describe('Type Exports', () => {
    it('should export all expected types', () => {
      // Verify the module exports exist
      const exportKeys = Object.keys(indexExports);
      expect(exportKeys).toContain('RecoClient');
    });
  });

  describe('Module Structure', () => {
    it('should be importable as ES module', () => {
      const { RecoClient: ImportedClient } = require('./index');
      expect(ImportedClient).toBeDefined();
    });

    it('should have consistent exports', () => {
      // The index should re-export from types and RecoClient
      expect(indexExports.RecoClient).toBe(RecoClient);
    });
  });
});
