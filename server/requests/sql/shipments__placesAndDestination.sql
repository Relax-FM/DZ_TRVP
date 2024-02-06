SELECT load, destinations.destination FROM cars left join shipments on (plate=car_plate) JOIN destinations on (destination_id = shipments.destination) where id = '${params.shipmentId}'
