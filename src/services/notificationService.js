/**
 * 알림 서비스
 * 사용자에게 성공, 오류, 경고 메시지를 표시하는 기능을 제공합니다.
 * 실제 구현은 UI 라이브러리(예: Element Plus, Vuetify 등)에 따라 달라질 수 있습니다.
 */

// 알림 타입
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * 알림 서비스 클래스
 * 이 클래스는 실제 UI 라이브러리와 통합될 때 구현될 예정입니다.
 */
class NotificationService {
  /**
   * 성공 메시지를 표시합니다.
   * @param {string} message - 표시할 메시지
   * @param {Object} options - 추가 옵션
   */
  success(message, options = {}) {
    this._notify(message, NotificationType.SUCCESS, options);
  }

  /**
   * 오류 메시지를 표시합니다.
   * @param {string} message - 표시할 메시지
   * @param {Object} options - 추가 옵션
   */
  error(message, options = {}) {
    this._notify(message, NotificationType.ERROR, options);
  }

  /**
   * 경고 메시지를 표시합니다.
   * @param {string} message - 표시할 메시지
   * @param {Object} options - 추가 옵션
   */
  warning(message, options = {}) {
    this._notify(message, NotificationType.WARNING, options);
  }

  /**
   * 정보 메시지를 표시합니다.
   * @param {string} message - 표시할 메시지
   * @param {Object} options - 추가 옵션
   */
  info(message, options = {}) {
    this._notify(message, NotificationType.INFO, options);
  }

  /**
   * 알림을 표시하는 내부 메서드
   * @param {string} message - 표시할 메시지
   * @param {string} type - 알림 타입
   * @param {Object} options - 추가 옵션
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  _notify(message, type, _options = {}) {
    // 개발 환경에서는 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // 실제 UI 라이브러리 통합 시 여기에 구현
    // 예: Element Plus의 경우
    // ElNotification({
    //   title: _options.title || type.charAt(0).toUpperCase() + type.slice(1),
    //   message,
    //   type,
    //   duration: _options.duration || 3000,
    //   position: _options.position || 'top-right',
    //   showClose: _options.showClose !== undefined ? _options.showClose : true
    // });
  }
}

// 싱글톤 인스턴스 생성
export const notificationService = new NotificationService();

export default notificationService;