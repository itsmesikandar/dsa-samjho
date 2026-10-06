import java.util.Arrays;

class Main {
    // Sabse kam bhookh wale bachche ko sabse chhoti chalne wali cookie - badi cookies baad ke liye bachao
    static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g); // bhookh: kam se zyada
        Arrays.sort(s); // cookie size: chhoti se badi //@sort
        int child = 0, cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) child++; // cookie kaafi hai - de do, agla bachcha //@give
            cookie++; // ye cookie ya to de di, ya kisi ke kaam ki nahi (sabse kam bhookh wala bhi nahi maana) //@next
        }
        return child; //@done
    }

    public static void main(String[] args) {
        System.out.println(findContentChildren(new int[] {3, 1, 5, 2}, new int[] {2, 4, 1, 3}));
        System.out.println(findContentChildren(new int[] {5}, new int[] {1, 2}));
        System.out.println(findContentChildren(new int[] {1, 2}, new int[] {3}));
    }
}

// Output:
// 3
// 0
// 1
