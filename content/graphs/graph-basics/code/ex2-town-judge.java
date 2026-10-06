class Main {
    // Judge: kisi par trust nahi karta (out = 0), baaki sab us par karte hain (in = n - 1)
    static int findJudge(int n, int[][] trust) {
        int[] score = new int[n + 1]; // har insaan ka (in - out); log 1..n //@init
        for (int[] t : trust) {
            score[t[0]]--; // a ne kisi par trust kiya - a judge nahi ho sakta //@out
            score[t[1]]++; // b par ek aur trust //@in
        }
        for (int p = 1; p <= n; p++) {
            if (score[p] == n - 1) return p; // n - 1 tabhi jab in = n - 1 aur out = 0 //@check
        }
        return -1; // koi judge nahi //@none
    }

    public static void main(String[] args) {
        System.out.println(findJudge(4, new int[][] {{1, 3}, {2, 3}, {4, 3}}));
        System.out.println(findJudge(3, new int[][] {{1, 3}, {2, 3}, {3, 1}}));
        System.out.println(findJudge(1, new int[][] {}));
    }
}

// Output:
// 3
// -1
// 1
