class Main {
    // Do deewarein chuno jinke beech sabse zyada paani aaye
    static int maxArea(int[] h) {
        int l = 0; //@init
        int r = h.length - 1;
        int best = 0;
        while (l < r) {
            int area = Math.min(h[l], h[r]) * (r - l); // paani = chhoti deewar x doori //@area
            best = Math.max(best, area);
            if (h[l] < h[r]) {
                l++; // chhoti deewar hatao - badi ko rakhne se hi aage fayda ho sakta hai //@moveL
            } else {
                r--; //@moveR
            }
        }
        return best; //@done
    }

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
        System.out.println(maxArea(new int[]{1, 1}));
    }
}

// Output:
// 49
// 1
