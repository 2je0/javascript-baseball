const MissionUtils = require('@woowacourse/mission-utils');

const { Random, Console } = MissionUtils;
const STRIKE = 1;
const BALL = 0;
const END = '2';

class App {
  play() {
    Console.print('숫자 야구 게임을 시작합니다.');
    const answer = this.randomGenerator();
    this.startQuery(answer);
  }

  startQuery(answer) {
    Console.readLine('숫자를 입력해주세요 : ', (query) => {
      this.checkError(query);
      const score = this.getScore(answer, query);
      this.printFeedback(score);
      if (this.isFinish(score)) {
        this.replayOrQuit();
      } else {
        this.startQuery(answer);
      }
    });
  }

  randomGenerator() {
    const ret = [];
    while (ret.length < 3) {
      const num = Random.pickNumberInRange(1, 9);
      if (ret.indexOf(num) === -1) ret.push(num);
    }
    return ret;
  }

  checkError(query) {
    if (this.hasError(query)) throw new Error('사용자 인풋 에러');
  }

  hasError(query) {
    let err = false;
    const queryArr = this.getQueryArrFromQuery(query);
    const querySet = new Set(queryArr);
    if (queryArr.length > 3) return true;
    if (querySet.size !== 3) return true;
    queryArr.forEach((num) => {
      if (Number.isNaN(+num) || +num < 1 || +num > 9) err = true;
    });
    return err;
  }

  getScore(answer, query) {
    const queryArr = this.getQueryArrFromQuery(query);
    let strike = 0;
    let ball = 0;
    answer.forEach((num, idx) => {
      const hasNumber = queryArr.indexOf(num.toString());
      if (hasNumber === idx) strike += 1;
      else if (hasNumber !== -1) ball += 1;
    });
    return [ball, strike];
  }

  getQueryArrFromQuery(query) {
    return query.toString().split('');
  }

  printFeedback(score) {
    const ballFeedback = (score[BALL] && `${score[BALL]}볼 `) || '';
    const strikeFeedback = (score[STRIKE] && `${score[STRIKE]}스트라이크`) || '';
    Console.print(ballFeedback + strikeFeedback || '낫싱');
  }

  isFinish(score) {
    if (score[STRIKE] === 3) return true;
    return false;
  }

  replayOrQuit() {
    Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
    Console.readLine(
      '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요. ',
      (input) => {
        if (input === END) {
          this.quitGame();
        } else {
          this.play();
        }
      },
    );
  }

  quitGame() {
    Console.close();
  }
}

module.exports = App;
