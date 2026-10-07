class Main {
    // Land ('1') ka har naya piece = ek island. DFS se poora piece "dooba do" ('0') taaki dobara na count kiye
    static void sink(char[][] grid, int i, int j) {
        if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] != '1') return; // bahar / paani / pehle dooba //@stop
        grid[i][j] = '0'; // dooba diya - yahi visited ka kaam karta hai //@mark
        sink(grid, i + 1, j);
        sink(grid, i - 1, j);
        sink(grid, i, j + 1);
        sink(grid, i, j - 1);
    }

    static int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') { // abhi tak kisi DFS ne nahi dubaya - naya island //@found
                    count++;
                    sink(grid, i, j); //@sink
                }
            }
        }
        return count; //@done
    }

    static char[][] of(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    public static void main(String[] args) {
        System.out.println(numIslands(of("11000", "11010", "00100", "00011")));
        System.out.println(numIslands(of("111", "010", "111")));
        System.out.println(numIslands(of("000")));
    }
}

// Output:
// 4
// 1
// 0
