import { PrettyFileSizePipe } from './pretty-file-size.pipe';

describe('PrettyFileSizePipe', () => {
  it('create an instance', () => {
    const pipe = new PrettyFileSizePipe();
    expect(pipe).toBeTruthy();
  });
});
