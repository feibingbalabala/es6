// 彻底冻结整个对象，包括对象中的key
var constatize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((item, val) => {
    if(typeof obj[key] === 'object') {
      constatize(obj[key]);
    };
  });
};