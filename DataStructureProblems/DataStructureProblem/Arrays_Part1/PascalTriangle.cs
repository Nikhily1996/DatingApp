using System;
using System.Collections.Generic;
using System.Text;
//Pascal triangle is named after mathematician , where each level has cooefficitent of binomial expansion (a+b)^n
namespace DataStructureProblem.Arrays_Part1
{
    /*
     *              1
     *            1   1
     *           1  2  1
     *          1  3  3  1
     *         1  4  6  4  1
     * 
     */
    class PascalTriangle : ISolvable
    {
       public void Solve()
        {
            //print All rows till N th row
            List<List<int>> pascalTriangleData = new List<List<int>>();
            int n = 10;
            for (int i=0;i<n;i++ ) {
                pascalTriangleData.Add(new List<int>());
                for (int j = 0; j <= i; j++) {
                    if (j == 0 || j == i)
                    {
                        pascalTriangleData[i].Add(1);
                    }
                    else {
                        pascalTriangleData[i].Add(pascalTriangleData[i-1][j-1]+pascalTriangleData[i-1][j]);
                    }
                    Console.Write(" " +pascalTriangleData[i][j]);  
                }
                Console.WriteLine();
            }

            // find N th term --> it is  n-1 ^ C r-1
            Console.WriteLine("-------------**************-------------------");
            int c = 5;
            Console.WriteLine("10 th row 5 th element is " + getBinomialCoefficent(n-1,c-1));
            Console.WriteLine("-------------**************-------------------");
             
            // find the N th rown alone
            int value = 1;
            Console.WriteLine(" 10 th row ");
            //since its n-1 th power expansion 
            Console.Write(value);
            int N = n-1;
            int R = 1;
            for (int i = 1; i <= n-1; i++, N--) {
                value = value * N;
                value = value / R;
                R++;
                Console.Write(" "+value);
            }
            Console.WriteLine();
        }

        int getBinomialCoefficent(int n,int r) {

            int N = 1;
            int R = 1;
            for (int i = 0; i < r; i++) {
                N = N * n ;
                n = n - 1;
                R = R * (i + 1);
            }
            return N / R;
        }
    }
}
