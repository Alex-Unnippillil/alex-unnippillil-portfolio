import DpiAware from '../../src/utils/dpiAware';

describe('dpiAware', () => {
  function createCanvas() {
    return { width: 100, height: 50, style: {} } as any as HTMLCanvasElement;
  }

  function createContext() {
    return { scale: jest.fn() } as any as CanvasRenderingContext2D;
  }

  it('standard display', () => {
    (global as any).window = { devicePixelRatio: 1 };
    const canvas = createCanvas();
    const ctx = createContext();
    DpiAware.scaleCanvas(canvas, ctx);
    expect({
      ratio: DpiAware.getCssPixelRatio(),
      canvas,
      calls: (ctx.scale as any).mock.calls,
    }).toMatchSnapshot();
  });

  it('retina display', () => {
    (global as any).window = { devicePixelRatio: 2 };
    const canvas = createCanvas();
    const ctx = createContext();
    DpiAware.scaleCanvas(canvas, ctx);
    expect({
      ratio: DpiAware.getCssPixelRatio(),
      canvas,
      calls: (ctx.scale as any).mock.calls,
    }).toMatchSnapshot();
  });
});

