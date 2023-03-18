const sumRestParts = (list: any) => {
  const parts = list.map((item: any) => {
    const quantity = Number(item.quantity);
    return quantity;
  });
  const sumParts = parts.reduce((partialSum: any, a: any) => partialSum + a, 0);
  return sumParts;
};

export {sumRestParts};
