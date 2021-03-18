import { render, fireEvent } from '@testing-library/vue';
import MotorSnapshot from '@/components/MotorSnapshot';
import DataRecorder from '@/components/DataRecorder';


describe('MotorSnapshot.vue', () => {
  test('renders', () => {
    const { getByText } = render(MotorSnapshot);
    getByText('Download Snapshots');
  })

  test('displays correct data', async () => {
    const testData = {
        snapshot_time: 0,
        snapshot_position: 0,
        snapshot_velocity: 0,
        snapshot_command: 0,
        snapshot_drive: 0,
        snapshot_error: 0,
    }
    const { getByText } = render(MotorSnapshot);
    
    
  })
  
})
