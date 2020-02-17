import { combine } from '../../../main/ts/lib/utils';
import { HttpStatus } from '../../../main/ts/state/status';

describe ('Utils', () => {

  describe ('combine', () => {

    it ('should return failure when there is at least one failure', () => {
      const actual = combine (
          HttpStatus.Progressing,
          HttpStatus.Success,
          HttpStatus.Failure,
          HttpStatus.Progressing
      );

      expect (actual).toBe (HttpStatus.Failure);
    });

    it ('should return "progressing" when there is no failure but not only success', () => {
      const actual = combine (
          HttpStatus.Success,
          HttpStatus.Success,
          HttpStatus.Progressing,
          HttpStatus.Success
      );

      expect (actual).toBe (HttpStatus.Progressing);
    });

    it ('should return "success" when there are only successes', () => {
      const actual = combine (
          HttpStatus.Success,
          HttpStatus.Success,
          HttpStatus.Success
      );

      expect (actual).toBe (HttpStatus.Success);
    })

  });

});
