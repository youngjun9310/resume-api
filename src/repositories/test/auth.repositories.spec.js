const authRepository = require('../auth.repository.js');

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  user: {
    findFirst: jest.fn(),//mockReturn값 들어옴
  },
};

let AuthRepository = new authRepository(mockPrisma);

describe('Auth Repository Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('tokenVerify Method', async () => {
    const mockReturn = 'tokenVerified';
    mockPrisma.user.findFirst.mockReturnValue(mockReturn);

    const auth = await AuthRepository.tokenVerify(token);
    expect(auth).toBe(mockReturn);
    expect(AuthRepository.prisma.auth.findFirst).toHaveBeenCalledTimes(1);
  });
});