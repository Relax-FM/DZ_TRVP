SELECT sum(amount*volume) FROM cargos where shipment_id = '${params.shipmentId}'
