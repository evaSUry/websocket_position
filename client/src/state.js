import { atom, selectorFamily } from 'recoil';

export const positionsState = atom({
  key: 'positionsState',
  default: Array(10).fill(""), // Initialize 10 empty positions
});

export const positionSelector = selectorFamily({
  key: "positionSelector",
  get:
    (index) =>
    ({ get }) => {
      const positions = get(positionsState);
      return positions[index] || "";
    },
  set:
    (index) =>
    ({ set }, newValue) => {
      set(positionsState, (prevPositions) => {
        const updated = [...prevPositions];
        updated[index] = newValue;
        return updated;
      });
    },
});
