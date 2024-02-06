import Shipments from "@components/Shipments/shipments";

/**
 * Массив объектов с url и функциями отрисовки страниц
 */
export const routes = {
  shipments: {
    render: Shipments
  },
  '': {
    render: Shipments
  }
};
