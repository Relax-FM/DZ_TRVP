SELECT load FROM cars left join shipments on (plate=car_plate) where id = '${params.shipmentId}'
