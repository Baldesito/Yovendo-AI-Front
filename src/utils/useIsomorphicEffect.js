import { useEffect, useLayoutEffect } from 'react';

// Il polyfill per useLayoutEffect
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicEffect;