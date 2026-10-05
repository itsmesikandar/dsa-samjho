import java.util.*;

class Main {
    // Matrix ko spiral (gol-gol, bahar se andar) order mein padho
    static List<Integer> spiral(int[][] m) {
        List<Integer> res = new ArrayList<>();
        int top = 0; //@init
        int bottom = m.length - 1;
        int left = 0;
        int right = m[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) res.add(m[top][c]); // upar wali row: left -> right //@top
            top++;
            for (int r = top; r <= bottom; r++) res.add(m[r][right]); // right column: upar -> neeche //@right
            right--;
            if (top <= bottom) { // abhi koi row bachi hai?
                for (int c = right; c >= left; c--) res.add(m[bottom][c]); // neeche wali row: right -> left //@bottom
                bottom--;
            }
            if (left <= right) { // abhi koi column bacha hai?
                for (int r = bottom; r >= top; r--) res.add(m[r][left]); // left column: neeche -> upar //@left
                left++;
            }
        }
        return res; //@done
    }

    public static void main(String[] args) {
        int[][] m = {
            {1, 2, 3, 4},
            {5, 6, 7, 8},
            {9, 10, 11, 12},
        };
        System.out.println(spiral(m));
    }
}

// Output:
// [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
