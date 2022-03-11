using System;
using System.Collections.Generic;
using System.Text;

namespace DataStructureProblem.Arrays_Part1
{
    class NextPermutation : ISolvable
    {
        public void Solve()
        {
            NextPermutationOfInput(new int[]{ 2,1,3,4 });
            NextPermutationOfInput(new int[] { 2, 1, 3, 4 ,5,7,6});
        }
        private void NextPermutationOfInput(int[] numbers)
        {
            if (numbers.Length == 0 || numbers == null) return;
            int i = numbers.Length - 2;
            while (i >= 0 && numbers[i] > numbers[i + 1]) i--;
            if (i > 0)
            {
                int j = numbers.Length - 1;
                while (numbers[j] < numbers[i]) j--;
                swap(i, j, numbers);
            }
            Reverse(i + 1, numbers);
            for (int j = 0; j < numbers.Length; j++)
            {
                Console.Write(" " + numbers[j]);
            }
            Console.WriteLine();
        }
        public void Reverse(int i, int[] numbers)
        {
            int j = numbers.Length - 1;
            while (i < j) swap(i++, j--, numbers);
        }
        public void swap(int i, int j, int[] numbers)
        {
            int temp = numbers[i];
            numbers[i] = numbers[j];
            numbers[j] = temp;
        }
    }
}
