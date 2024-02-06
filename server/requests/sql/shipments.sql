SELECT order_sh, id, car_plate, destinations.destination, destinations.destination_id FROM public.shipments JOIN destinations on (destination_id = shipments.destination) ORDER BY order_sh ASC
