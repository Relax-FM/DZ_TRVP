SELECT sum(amount*volume) FROM cargos where shipment_id = '${params.shipmentId}' and cargo_id != '${params.cargoId}'
