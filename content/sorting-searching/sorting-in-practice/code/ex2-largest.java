import java.util.Arrays;

class Main {
    // Numbers ko aise line mein jodo ki sabse bada number bane (answer String mein)
    static String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        // a pehle ya b? Dono order jod ke dekho: "a+b" bada ho to a pehle
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b)); //@sort
        if (s[0].equals("0")) return "0"; // sab zero: "000" nahi, "0" //@zero
        return String.join("", s); //@join
    }

    public static void main(String[] args) {
        System.out.println(largestNumber(new int[]{3, 30, 34, 5, 9}));
        System.out.println(largestNumber(new int[]{0, 0}));
    }
}

// Output:
// 9534330
// 0
