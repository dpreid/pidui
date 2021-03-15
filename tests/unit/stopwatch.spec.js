import { render, fireEvent } from '@testing-library/vue';
import Stopwatch from '@/components/Stopwatch'

describe('Stopwatch.vue', () => {
  test('renders', () => {
    const { getByText } = render(Stopwatch);
    getByText('Start');
  })

  test('starts', async () => {
    const { getByText } = render(Stopwatch);
    const startButton = getByText('Start');
    await fireEvent.click(startButton);
    getByText('Pause');
  })
})
