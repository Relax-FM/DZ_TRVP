SELECT destinations.destination FROM shipments JOIN destinations on (destination_id = shipments.destination) where id = '${params.shipmentId}'
