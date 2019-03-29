export const INTERACTION_MAP = {};

export const getInteraction = type => {
  return INTERACTION_MAP[type];
};

export const registerInteraction = (type, ctor) => {
    // 注册的时候，需要校验 type 重名，不区分大小写
  if (getInteraction(type)) {
    throw new Error(`Interaction type '${type}' existed.`);
  }
    // 存储到 map 中
  INTERACTION_MAP[type] = ctor;
};
