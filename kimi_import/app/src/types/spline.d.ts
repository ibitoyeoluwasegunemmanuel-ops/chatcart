declare module '@splinetool/react-spline' {
  import type { ComponentType } from 'react';

  interface SplineProps {
    scene: string;
    className?: string;
  }

  const Spline: ComponentType<SplineProps>;
  export default Spline;
}
