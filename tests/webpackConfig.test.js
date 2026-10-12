import { describe, expect, it } from 'vitest';

import createConfig from '../webpack.config.js';

describe('webpack config', () => {
  it('is a function of (env, argv)', () => {
    expect(typeof createConfig).toBe('function');
  });

  it('emits no source map in production', () => {
    const config = createConfig({}, { mode: 'production' });

    expect(config.mode).toBe('production');
    expect(config.devtool).toBe(false);
  });

  it('keeps source maps in development', () => {
    const config = createConfig({}, { mode: 'development' });

    expect(config.mode).toBe('development');
    expect(config.devtool).toBe('source-map');
  });

  it('defaults to development when no mode is given', () => {
    const config = createConfig({}, {});

    expect(config.mode).toBe('development');
    expect(config.devtool).toBe('source-map');
    expect(createConfig({}).mode).toBe('development');
  });

  it('keeps dev server behavior', () => {
    const { devServer } = createConfig({}, { mode: 'development' });

    expect(devServer.port).toBe(8080);
    expect(devServer.hot).toBe(true);
    expect(devServer.historyApiFallback).toBe(true);
  });
});
