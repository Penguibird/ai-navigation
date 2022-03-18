export default ([x1,y1]: [number, number], [x2,y2]: [number, number]) => {
  const dx = Math.abs(x1-x2)
  const dy = Math.abs(y1-y2)
  const d = Math.sqrt(dx*dx + dy*dy);
  return d;
}