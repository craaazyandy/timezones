<?php
 namespace App\Entity;
 use Doctrine\ORM\Mapping as ORM;
 use Symfony\Component\Validator\Constraints as Assert;
 /**
  * @ORM\Entity
  * @ORM\Table(name="timezone")
  * @ORM\HasLifecycleCallbacks()
  */
 class Timezone implements \JsonSerializable {

  /** MODEL
   * @ORM\Column(type="integer")
   * @ORM\Id
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  private $id;
  /**
   * @ORM\Column(type="string", length=100)
   *
   */
  private $email;
  /**
   * @ORM\Column(type="string", length=100)
   *
   */
  private $timezone;
  /** 
   * @ORM\Column(type="integer")
   * 
   */
  private $offset;

  /** MODEL FUNCTIONS
   * @return mixed
   */
  public function getId()
  {
   return $this->id;
  }
  /**
   * @param mixed $id
   */
  public function setId($id)
  {
   $this->id = $id;
  }
  /**
   * @return mixed
   */
  public function getEmail()
  {
   return $this->email;
  }
  /**
   * @param mixed $email
   */
  public function setEmail($email)
  {
   $this->email = $email;
  }
  /**
   * @return mixed
   */
  public function getTimezone()
  {
   return $this->timezone;
  }
  /**
   * @param mixed $timezone
   */
  public function setTimezone($timezone)
  {
   $this->timezone = $timezone;
  }
  /**
   * @return mixed
   */
  public function getOffset()
  {
   return $this->offset;
  }
  /**
   * @param mixed $offset
   */
  public function setOffset($offset)
  {
   $this->offset = $offset;
  }


  /**
   * Specify data which should be serialized to JSON
   * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
   * @return mixed data which can be serialized by <b>json_encode</b>,
   * which is a value of any type other than a resource.
   * @since 5.4.0
   */
  public function jsonSerialize()
  {
   return [
    "email" => $this->getEmail(),
    "timezone" => $this->getTimezone(),
    "offset" => $this->getOffset()
   ];
  }
 }