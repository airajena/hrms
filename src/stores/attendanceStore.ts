
import { create } from 'zustand';
import { AttendanceRecord } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  fetchAttendance: (employeeId?: string, date?: string) => void;
  punchIn: (employeeId: string, location?: string) => void;
  punchOut: (employeeId: string) => void;
  markManualAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

// Mock attendance data
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employees = ['1', '2', '3'];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    employees.forEach(empId => {
      const punchIn = new Date(date);
      punchIn.setHours(9, Math.floor(Math.random() * 30), 0);
      
      const punchOut = new Date(date);
      punchOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const totalHours = (punchOut.getTime() - punchIn.getTime()) / (1000 * 60 * 60);
      const overtime = Math.max(0, totalHours - 8);
      
      records.push({
        id: `${empId}-${date.toISOString().split('T')[0]}`,
        employeeId: empId,
        date: date.toISOString().split('T')[0],
        punchIn: punchIn.toTimeString().slice(0, 5),
        punchOut: punchOut.toTimeString().slice(0, 5),
        totalHours: Math.round(totalHours * 10) / 10,
        overtime: Math.round(overtime * 10) / 10,
        status: totalHours >= 8 ? 'Present' : totalHours >= 4 ? 'Half Day' : 'Absent',
        location: 'Mumbai Port'
      });
    });
  }
  
  return records;
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: generateMockAttendance(),
  loading: false,
  fetchAttendance: (employeeId?, date?) => {
    set({ loading: true });
    setTimeout(() => {
      set({ loading: false });
    }, 500);
  },
  punchIn: (employeeId, location = 'Mumbai Port') => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    
    const existingRecord = get().records.find(
      r => r.employeeId === employeeId && r.date === today
    );
    
    if (!existingRecord) {
      const newRecord: AttendanceRecord = {
        id: `${employeeId}-${today}`,
        employeeId,
        date: today,
        punchIn: time,
        totalHours: 0,
        overtime: 0,
        status: 'Present',
        location
      };
      
      set(state => ({
        records: [newRecord, ...state.records]
      }));
    }
  },
  punchOut: (employeeId) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    
    set(state => ({
      records: state.records.map(record => {
        if (record.employeeId === employeeId && record.date === today) {
          const punchInTime = new Date(`${today}T${record.punchIn}:00`);
          const punchOutTime = new Date(`${today}T${time}:00`);
          const totalHours = (punchOutTime.getTime() - punchInTime.getTime()) / (1000 * 60 * 60);
          const overtime = Math.max(0, totalHours - 8);
          
          return {
            ...record,
            punchOut: time,
            totalHours: Math.round(totalHours * 10) / 10,
            overtime: Math.round(overtime * 10) / 10,
            status: totalHours >= 8 ? 'Present' : totalHours >= 4 ? 'Half Day' : 'Absent'
          };
        }
        return record;
      })
    }));
  },
  markManualAttendance: (recordData) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `${recordData.employeeId}-${recordData.date}-manual`
    };
    
    set(state => ({
      records: [newRecord, ...state.records.filter(
        r => !(r.employeeId === recordData.employeeId && r.date === recordData.date)
      )]
    }));
  }
}));
