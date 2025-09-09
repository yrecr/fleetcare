/*
  # Sistema de Gestión de Mantenimiento Vehicular - Schema Completo

  1. New Tables
    - `profiles` - Perfiles de usuario con roles
    - `vehicles` - Información de vehículos
    - `technicians` - Información de técnicos
    - `spare_parts` - Inventario de repuestos
    - `maintenance_schedules` - Programación de mantenimiento
    - `work_orders` - Órdenes de trabajo
    - `maintenance_records` - Registros históricos de mantenimiento
    - `alerts` - Sistema de alertas y notificaciones

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Create functions for common operations

  3. Features
    - Gestión completa de vehículos
    - Control de inventario de repuestos
    - Programación automática de mantenimiento
    - Sistema de órdenes de trabajo
    - Alertas automáticas
    - Reportes y estadísticas
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'technician', 'supervisor')) DEFAULT 'technician',
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('truck', 'car', 'motorcycle', 'bus', 'van')),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1950 AND year <= 2030),
  capacity text,
  mileage integer NOT NULL DEFAULT 0,
  engine_hours integer DEFAULT 0,
  status text NOT NULL CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  acquisition_date date,
  last_maintenance_date date,
  next_maintenance_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage vehicles"
  ON vehicles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialties text[] NOT NULL DEFAULT '{}',
  phone text,
  email text UNIQUE,
  status text NOT NULL CHECK (status IN ('available', 'busy', 'on_leave')) DEFAULT 'available',
  hire_date date DEFAULT CURRENT_DATE,
  hourly_rate decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read technicians"
  ON technicians
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage technicians"
  ON technicians
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Spare Parts table
CREATE TABLE IF NOT EXISTS spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  part_number text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'general',
  description text,
  stock_quantity integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 5,
  max_stock integer NOT NULL DEFAULT 100,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  supplier text,
  supplier_part_number text,
  location text DEFAULT 'warehouse',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read spare parts"
  ON spare_parts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage spare parts"
  ON spare_parts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Maintenance Schedules table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('preventive', 'predictive')) DEFAULT 'preventive',
  name text NOT NULL,
  description text,
  frequency_type text NOT NULL CHECK (frequency_type IN ('time', 'mileage', 'hours')),
  frequency_value integer NOT NULL,
  last_performed_date date,
  last_performed_mileage integer,
  next_due_date date,
  next_due_mileage integer,
  is_active boolean DEFAULT true,
  estimated_duration_hours decimal(4,2) DEFAULT 2,
  estimated_cost decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read maintenance schedules"
  ON maintenance_schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage maintenance schedules"
  ON maintenance_schedules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Work Orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES technicians(id),
  schedule_id uuid REFERENCES maintenance_schedules(id),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status text NOT NULL CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  estimated_hours decimal(4,2) DEFAULT 1,
  actual_hours decimal(4,2),
  labor_cost decimal(10,2) DEFAULT 0,
  parts_cost decimal(10,2) DEFAULT 0,
  total_cost decimal(10,2) DEFAULT 0,
  scheduled_date date,
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read work orders"
  ON work_orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their work orders"
  ON work_orders
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() IN (SELECT id FROM technicians WHERE id = work_orders.technician_id) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Maintenance Records table
CREATE TABLE IF NOT EXISTS maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  technician_id uuid NOT NULL REFERENCES technicians(id),
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'predictive')),
  description text NOT NULL,
  parts_used jsonb DEFAULT '[]',
  labor_hours decimal(4,2) NOT NULL DEFAULT 0,
  labor_cost decimal(10,2) NOT NULL DEFAULT 0,
  parts_cost decimal(10,2) NOT NULL DEFAULT 0,
  total_cost decimal(10,2) NOT NULL DEFAULT 0,
  vehicle_mileage integer,
  vehicle_engine_hours integer,
  performed_at timestamptz DEFAULT now(),
  next_service_mileage integer,
  next_service_date date,
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read maintenance records"
  ON maintenance_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technicians can create their maintenance records"
  ON maintenance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT id FROM technicians WHERE id = maintenance_records.technician_id) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('maintenance_due', 'overdue_maintenance', 'low_stock', 'high_cost', 'vehicle_issue')),
  title text NOT NULL,
  message text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  related_id uuid, -- Can reference vehicles, work_orders, spare_parts, etc.
  related_table text,
  is_read boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spare_parts_updated_at BEFORE UPDATE ON spare_parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON maintenance_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next maintenance date
CREATE OR REPLACE FUNCTION calculate_next_maintenance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update maintenance schedules when a maintenance record is created
  IF NEW.maintenance_type = 'preventive' AND TG_OP = 'INSERT' THEN
    UPDATE maintenance_schedules 
    SET 
      last_performed_date = NEW.performed_at::date,
      last_performed_mileage = NEW.vehicle_mileage,
      next_due_date = CASE 
        WHEN frequency_type = 'time' THEN NEW.performed_at::date + (frequency_value || ' days')::interval
        ELSE next_due_date
      END,
      next_due_mileage = CASE 
        WHEN frequency_type = 'mileage' THEN NEW.vehicle_mileage + frequency_value
        ELSE next_due_mileage
      END,
      updated_at = now()
    WHERE vehicle_id = NEW.vehicle_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintenance_record_trigger 
  AFTER INSERT ON maintenance_records
  FOR EACH ROW EXECUTE FUNCTION calculate_next_maintenance();

-- Function to create low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.min_stock THEN
    INSERT INTO alerts (type, title, message, priority, related_id, related_table)
    VALUES (
      'low_stock',
      'Stock bajo: ' || NEW.name,
      'El repuesto ' || NEW.name || ' tiene stock bajo (' || NEW.stock_quantity || ' unidades restantes)',
      'medium',
      NEW.id,
      'spare_parts'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER low_stock_trigger 
  AFTER UPDATE ON spare_parts
  FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- Insert sample data
DO $$
BEGIN
  -- Sample vehicles
  INSERT INTO vehicles (plate, type, brand, model, year, mileage, status) VALUES
    ('ABC-123', 'truck', 'Volvo', 'FH16', 2020, 85000, 'active'),
    ('DEF-456', 'car', 'Toyota', 'Camry', 2019, 45000, 'active'),
    ('GHI-789', 'van', 'Ford', 'Transit', 2021, 32000, 'maintenance'),
    ('JKL-012', 'bus', 'Mercedes-Benz', 'Sprinter', 2018, 120000, 'active'),
    ('MNO-345', 'motorcycle', 'Honda', 'CBR600', 2022, 8000, 'active');

  -- Sample technicians
  INSERT INTO technicians (name, specialties, phone, email, status) VALUES
    ('Juan Pérez', ARRAY['motor', 'transmision'], '+1234567890', 'juan@fleetcare.com', 'available'),
    ('María García', ARRAY['electricidad', 'electronica'], '+1234567891', 'maria@fleetcare.com', 'available'),
    ('Carlos López', ARRAY['frenos', 'suspension'], '+1234567892', 'carlos@fleetcare.com', 'busy'),
    ('Ana Martínez', ARRAY['motor', 'frenos'], '+1234567893', 'ana@fleetcare.com', 'available');

  -- Sample spare parts
  INSERT INTO spare_parts (name, part_number, category, stock_quantity, min_stock, max_stock, unit_price, supplier) VALUES
    ('Filtro de Aceite', 'FO-001', 'motor', 25, 10, 50, 15.99, 'AutoParts Inc'),
    ('Pastillas de Freno', 'PF-002', 'frenos', 8, 10, 30, 45.50, 'Brake Masters'),
    ('Batería 12V', 'BAT-003', 'electricidad', 12, 5, 20, 89.99, 'Power Supply Co'),
    ('Correa de Distribución', 'CD-004', 'motor', 15, 8, 25, 78.25, 'AutoParts Inc'),
    ('Amortiguador Delantero', 'AD-005', 'suspension', 6, 4, 15, 125.00, 'Suspension Pro');

  -- Sample maintenance schedules
  INSERT INTO maintenance_schedules (vehicle_id, name, description, frequency_type, frequency_value, next_due_date)
  SELECT 
    v.id,
    'Mantenimiento Preventivo 5,000 km',
    'Cambio de aceite y filtros, revisión general',
    'mileage',
    5000,
    CURRENT_DATE + interval '30 days'
  FROM vehicles v
  WHERE v.plate = 'ABC-123';

  -- Sample work orders
  INSERT INTO work_orders (vehicle_id, technician_id, title, description, priority, status, estimated_hours)
  SELECT 
    v.id,
    t.id,
    'Mantenimiento Preventivo',
    'Cambio de aceite, filtros y revisión general del vehículo',
    'medium',
    'pending',
    3.0
  FROM vehicles v, technicians t
  WHERE v.plate = 'ABC-123' AND t.name = 'Juan Pérez';

  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors in sample data insertion
    NULL;
END $$;