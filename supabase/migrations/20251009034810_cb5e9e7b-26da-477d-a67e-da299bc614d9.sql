-- Allow supervisors to insert attendance for their interns
CREATE POLICY "Supervisors can insert attendance for their interns"
ON attendance
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles p
    JOIN internships i ON i.intern_id = p.id
    WHERE p.id = attendance.intern_id
    AND i.supervisor_id IN (
      SELECT profiles.id
      FROM profiles
      WHERE profiles.user_id = auth.uid()
    )
  )
);

-- Allow supervisors to update attendance for their interns
CREATE POLICY "Supervisors can update attendance for their interns"
ON attendance
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles p
    JOIN internships i ON i.intern_id = p.id
    WHERE p.id = attendance.intern_id
    AND i.supervisor_id IN (
      SELECT profiles.id
      FROM profiles
      WHERE profiles.user_id = auth.uid()
    )
  )
);

-- Allow supervisors to delete attendance for their interns
CREATE POLICY "Supervisors can delete attendance for their interns"
ON attendance
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles p
    JOIN internships i ON i.intern_id = p.id
    WHERE p.id = attendance.intern_id
    AND i.supervisor_id IN (
      SELECT profiles.id
      FROM profiles
      WHERE profiles.user_id = auth.uid()
    )
  )
);