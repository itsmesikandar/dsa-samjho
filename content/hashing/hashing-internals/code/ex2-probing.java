import java.util.Arrays;

class Main {
    // Open addressing (linear probing): collision ho to AGLA khaali dabba dhoondho
    static Integer[] insertAll(int[] keys, int m) {
        if (keys.length > m) throw new IllegalArgumentException("Table mein jagah kam hai");
        Integer[] table = new Integer[m];
        for (int k : keys) {
            int i = Math.floorMod(k, m); // pehli pasand //@hash
            while (table[i] != null) {
                i = (i + 1) % m; // bhara hai? agla dabba (end ke baad wapas 0) //@probe
            }
            table[i] = k; //@place
        }
        return table;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(insertAll(new int[]{18, 41, 22, 44, 59, 32, 31, 73}, 11)));
    }
}

// Output:
// [22, 44, 73, null, 59, null, null, 18, 41, 31, 32]
